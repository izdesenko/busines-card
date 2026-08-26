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
  }),
  actions: {
    async submit(input: ContactFormInput): Promise<ContactFormResult> {
      this.sending = true;
      try {
        const data = await gqlClient.request<SendContactFormResponse>(SEND_CONTACT_FORM, {
          input,
        });
        return data.sendContactForm;
      } finally {
        this.sending = false;
      }
    },
  },
});
