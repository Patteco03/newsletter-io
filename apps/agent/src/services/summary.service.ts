import OpenAI from 'openai';

export class SummaryService {
  private openai: OpenAI | null = null;
  private enabled: boolean;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    this.enabled = !!apiKey;
    
    if (this.enabled) {
      this.openai = new OpenAI({
        apiKey: apiKey,
      });
    }
  }

  /**
   * Gera um resumo de um texto com no máximo 160 caracteres
   */
  async generateSummary(text: string): Promise<string> {
    if (!this.enabled || !this.openai) {
      return this.generateSimpleSummary(text);
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente especializado em criar resumos concisos e informativos. Crie resumos que capturem os pontos principais do texto de forma clara e objetiva.',
          },
          {
            role: 'user',
            content: `Crie um resumo de no máximo 160 caracteres do seguinte texto:\n\n${text.substring(0, 4000)}`,
          },
        ],
        max_tokens: 50,
        temperature: 0.7,
      });

      const summary = response.choices[0]?.message?.content?.trim() || '';
      

      if (summary.length > 160) {
        return summary.substring(0, 157) + '...';
      }

      return summary || this.generateSimpleSummary(text);
    } catch (error) {
      console.error('Erro ao gerar resumo com IA:', error);
      return this.generateSimpleSummary(text);
    }
  }

  /**
   * Gera um resumo simples sem IA (fallback)
   */
  private generateSimpleSummary(text: string): string {
    const cleaned = text.replace(/\s+/g, ' ').trim();
    
    if (cleaned.length <= 160) {
      return cleaned;
    }

    const truncated = cleaned.substring(0, 157);
    const lastPeriod = truncated.lastIndexOf('.');
    const lastExclamation = truncated.lastIndexOf('!');
    const lastQuestion = truncated.lastIndexOf('?');
    
    const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);
    
    if (lastSentenceEnd > 80) {

      return truncated.substring(0, lastSentenceEnd + 1);
    }

    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 80) {
      return truncated.substring(0, lastSpace) + '...';
    }

    return truncated + '...';
  }

  isAIAvailable(): boolean {
    return this.enabled;
  }
}

