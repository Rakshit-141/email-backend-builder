import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { Response } from 'express';

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  // Upload a new email template to the database
  @Post('uploadEmailTemplate')
  async uploadTemplate(
    @Body()
    body: {
      name: string;
      htmlContent: string;
      variables: Record<string, string>;
      base64Image?: string; // ✅ Accept optional Base64 image
    }
  ) {
    return await this.templateService.saveTemplate(
      body.name,
      body.htmlContent,
      body.variables,
      body.base64Image // ✅ Pass Base64 image to service
    );
  }

  // Get all email templates from the database
  @Get('getEmailTemplates')
  async getTemplates() {
    return await this.templateService.getTemplates();
  }

  // Get a single template by ID
  @Get('getEmailTemplate/:id')
  async getTemplateById(@Param('id') id: string) {
    const template = await this.templateService.getTemplateById(id);

    return {
      ...template, // ✅ No need for `.toObject()` anymore!
      base64Image: template.base64Image || null,
    };
  }

  // Load default templates from files
  @Get('getDefaultTemplates')
  getDefaultTemplates() {
    return this.templateService.getDefaultTemplates();
  }

  // Render and download an email template
  @Get('renderAndDownloadTemplate/:id')
  async renderTemplate(@Param('id') id: string, @Res() res: Response) {
    try {
      const htmlContent = await this.templateService.renderTemplate(id, {
        title: 'Welcome Email',
        content: 'This is a dynamic email content',
        footer: 'Best Regards, Your Company',
      });

      res.setHeader('Content-Type', 'text/html');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=template.html'
      );
      res.send(htmlContent);
    } catch (error) {
      throw new NotFoundException('Error rendering email template.');
    }
  }
}
