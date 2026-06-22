import { google, drive_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../database/models/User.js';
import stream from 'stream';

const CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.FRONTEND_URL || 'http://localhost:3000'; // We use postMessage flow or standard redirect

export class GoogleDriveService {
  /**
   * Creates an OAuth2 client configured with our app credentials
   */
  private static createOAuthClient(): OAuth2Client {
    if (!CLIENT_ID || !CLIENT_SECRET) {
      throw new Error('Google Client ID o Secret no están configurados en .env');
    }
    // Para el postMessage flow de react-oauth/google, el redirect uri suele ser 'postmessage'
    return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, 'postmessage');
  }

  /**
   * Exchange authorization code for tokens
   */
  static async exchangeCodeForTokens(code: string) {
    const oAuth2Client = this.createOAuthClient();
    const { tokens } = await oAuth2Client.getToken(code);
    return tokens;
  }

  /**
   * Get an authenticated client for a specific user
   */
  static async getAuthClient(userId: string): Promise<OAuth2Client> {
    const user = await User.findById(userId);
    if (!user || !user.googleDriveInfo?.isLinked || !user.googleDriveInfo.refreshToken) {
      throw new Error('Usuario no tiene Google Drive vinculado');
    }

    const oAuth2Client = this.createOAuthClient();
    oAuth2Client.setCredentials({
      access_token: user.googleDriveInfo.accessToken,
      refresh_token: user.googleDriveInfo.refreshToken,
    });

    // Handle token refresh automatically and save new access_token
    oAuth2Client.on('tokens', async (tokens) => {
      if (tokens.access_token) {
        user.googleDriveInfo!.accessToken = tokens.access_token;
        if (tokens.refresh_token) {
          user.googleDriveInfo!.refreshToken = tokens.refresh_token;
        }
        await user.save();
      }
    });

    return oAuth2Client;
  }

  /**
   * Create a folder in Google Drive
   */
  static async createFolder(auth: OAuth2Client, name: string, parentId?: string): Promise<string> {
    const drive = google.drive({ version: 'v3', auth });
    
    const fileMetadata: any = {
      name: name,
      mimeType: 'application/vnd.google-apps.folder',
    };
    
    if (parentId) {
      fileMetadata.parents = [parentId];
    }

    const response = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id',
    });

    return response.data.id!;
  }

  /**
   * Upload a file to Google Drive
   */
  static async uploadFile(
    auth: OAuth2Client, 
    buffer: Buffer, 
    name: string, 
    mimeType: string, 
    parentId?: string
  ): Promise<{ id: string; webViewLink: string }> {
    const drive = google.drive({ version: 'v3', auth });
    
    const bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);

    const fileMetadata: any = {
      name: name,
    };
    
    if (parentId) {
      fileMetadata.parents = [parentId];
    }

    const media = {
      mimeType: mimeType,
      body: bufferStream,
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    return { id: response.data.id!, webViewLink: response.data.webViewLink! };
  }

  /**
   * Delete a file or folder from Google Drive
   */
  static async deleteFile(auth: OAuth2Client, fileId: string): Promise<void> {
    const drive = google.drive({ version: 'v3', auth });
    try {
      await drive.files.delete({ fileId });
    } catch (error: any) {
      // Ignore 404 (already deleted)
      if (error.code !== 404) throw error;
    }
  }

  /**
   * Check if a file or folder exists
   */
  static async checkFileExists(auth: OAuth2Client, fileId: string): Promise<boolean> {
    const drive = google.drive({ version: 'v3', auth });
    try {
      await drive.files.get({ fileId, fields: 'id' });
      return true;
    } catch (error: any) {
      if (error.code === 404) return false;
      throw error;
    }
  }

  /**
   * Rename a file or folder
   */
  static async renameFile(auth: OAuth2Client, fileId: string, newName: string): Promise<void> {
    const drive = google.drive({ version: 'v3', auth });
    await drive.files.update({
      fileId,
      requestBody: {
        name: newName
      }
    });
  }

  /**
   * Get text content of a file
   */
  static async getFileTextContent(auth: OAuth2Client, fileId: string): Promise<string> {
    const drive = google.drive({ version: 'v3', auth });
    const response = await drive.files.get({
      fileId,
      alt: 'media'
    }, { responseType: 'text' });
    
    return response.data as string;
  }

  /**
   * Update text content of a file
   */
  static async updateFileTextContent(auth: OAuth2Client, fileId: string, newContent: string): Promise<void> {
    const drive = google.drive({ version: 'v3', auth });
    
    const bufferStream = new stream.PassThrough();
    bufferStream.end(Buffer.from(newContent, 'utf-8'));

    await drive.files.update({
      fileId,
      media: {
        mimeType: 'text/plain',
        body: bufferStream
      }
    });
  }

  /**
   * Get storage quota
   */
  static async getStorageQuota(auth: OAuth2Client): Promise<{ usage: number; limit: number }> {
    const drive = google.drive({ version: 'v3', auth });
    const response = await drive.about.get({ fields: 'storageQuota' });
    const quota = response.data.storageQuota;
    return {
      usage: parseInt(quota?.usage || '0', 10),
      limit: parseInt(quota?.limit || '0', 10)
    };
  }

  /**
   * Initialize root folder "LaPaginaDeLardi"
   * First checks if one exists by name to avoid duplicates
   */
  static async initializeRootFolder(auth: OAuth2Client): Promise<string> {
    const drive = google.drive({ version: 'v3', auth });
    const folderName = 'LaPaginaDeLardi';
    
    // Search for existing folder
    const response = await drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id)',
      spaces: 'drive'
    });
    
    if (response.data.files && response.data.files.length > 0) {
      return response.data.files[0].id!;
    }
    
    // Create new if not exists
    return await this.createFolder(auth, folderName);
  }
}
