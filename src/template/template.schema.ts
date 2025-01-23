import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type TemplateDocument = Template & Document;

@Schema()
export class Template {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  htmlContent: string;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  variables: Record<string, string>;

  @Prop({ type: String }) // ✅ Store Base64 image string in MongoDB
  base64Image?: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}


export const TemplateSchema = SchemaFactory.createForClass(Template);
