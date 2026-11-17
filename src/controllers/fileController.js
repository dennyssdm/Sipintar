import * as fileService from '../services/fileService.js';

/**
 * Controller to stream or download a resource file with strict RBAC & classification guards
 * GET /api/v1/resources/:id/file
 */
export async function serveResourceFile(req, res, next) {
  try {
    const { id } = req.params;
    const isDownload = req.query.download === 'true';

    const meta = {
      ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent']
    };

    const fileResult = await fileService.getResourceFile(id, req.user, isDownload, meta);

    const dispositionType = fileResult.isDownload ? 'attachment' : 'inline';
    // Clean filename for HTTP header
    const safeHeaderFilename = encodeURIComponent(fileResult.filename);

    res.setHeader('Content-Type', fileResult.mimeType);
    res.setHeader('Content-Disposition', `${dispositionType}; filename="${safeHeaderFilename}"`);

    return res.sendFile(fileResult.filePath);
  } catch (error) {
    next(error);
  }
}

/**
 * Controller to stream a safe 10-20 page sample preview of a book
 * GET /api/v1/library/books/:id/preview
 */
export async function serveBookPreview(req, res, next) {
  try {
    const { id } = req.params;
    const fileResult = await fileService.getBookPreviewFile(id);

    const safeHeaderFilename = encodeURIComponent(fileResult.filename);

    res.setHeader('Content-Type', fileResult.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${safeHeaderFilename}"`);

    return res.sendFile(fileResult.filePath);
  } catch (error) {
    next(error);
  }
}

