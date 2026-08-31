import { defineStore } from 'pinia';
import { gqlClient } from '@/graphql/client';
import { SEND_CONTACT_FORM } from '@/graphql/mutations';
import type { ContactFormInput, ContactFormResult } from '@/types';
import { useTextContentStore } from './textContent';

interface SendContactFormResponse {
  sendContactForm: ContactFormResult;
}

export const useContactFormStore = defineStore('contactForm', {
  actions: {
    clearError() {
      this.error = null;
    },
    async submit(input: ContactFormInput): Promise<ContactFormResult> {
      this.sending = true;
      this.error = null;
      try {
        const { sendContactForm } = await gqlClient.request<SendContactFormResponse>(
          SEND_CONTACT_FORM,
          { input },
        );
        return sendContactForm;
      } catch (e) {
        const textContent = useTextContentStore();
        this.error =
          e instanceof Error
            ? e.message
            : textContent.get('text_error_sending_message', 'Не удалось отправить сообщение');
        throw e;
      } finally {
        this.sending = false;
      }
    },
  },
  state: () => ({
    error: null as string | null,
    sending: false,
  }),
});
