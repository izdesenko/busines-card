import { defineStore } from 'pinia';
import { gqlClient } from '@/graphql/client';
import { SEND_CONTACT_FORM } from '@/graphql/mutations';
import type { ContactFormInput, ContactFormResult } from '@/types';

interface SendContactFormResponse {
  sendContactForm: ContactFormResult;
}

export const useContactFormStore = defineStore('contactForm', {
  state: () => ({
    sending: false,
    error: null as string | null,
  }),
  actions: {
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
        this.error = e instanceof Error ? e.message : 'Не удалось отправить сообщение';
        throw e;
      } finally {
        this.sending = false;
      }
    },
    clearError() {
      this.error = null;
    },
  },
});
