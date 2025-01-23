import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { Template, TemplateDocument } from './template.schema';

@Injectable()
export class TemplateService {
  constructor(
    @InjectModel(Template.name) private templateModel: Model<TemplateDocument>
  ) {}

  // Save a new email template in the database
  async saveTemplate(
    name: string,
    htmlContent: string,
    variables: Record<string, string>,
    base64Image?: string // ✅ Allow storing Base64 images
  ): Promise<Template> {
    return await this.templateModel.create({
      name,
      htmlContent,
      variables,
      base64Image,
    });
  }

  // Fetch all email templates from the database
  async getTemplates(): Promise<Template[]> {
    return await this.templateModel.find();
  }

  // Get a specific template by ID
  async getTemplateById(id: string): Promise<Template | null> {
    const template = await this.templateModel.findById(id).lean(); // ✅ Best practice
    if (!template) throw new NotFoundException('Template not found');
    return template;
  }

  // Load default templates from the `/templates` folder
  getDefaultTemplates(): { name: string; content: string }[] {
    const templatesDir = path.join(__dirname, '../../templates');
    const templateFiles = fs.readdirSync(templatesDir);
    return templateFiles.map((file) => ({
      name: file.replace('.html', ''),
      content: fs.readFileSync(path.join(templatesDir, file), 'utf8'),
    }));
  }

  // Render a template dynamically by replacing placeholders with actual values
  async renderTemplate(
    id: string,
    data: Record<string, string>
  ): Promise<string> {
    const template = await this.getTemplateById(id);
    let renderedHtml = template.htmlContent;

    // Replace placeholders like {{title}} with actual data
    for (const [key, value] of Object.entries(data)) {
      renderedHtml = renderedHtml.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    return renderedHtml;
  }
}
