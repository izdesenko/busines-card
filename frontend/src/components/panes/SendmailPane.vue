<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import CopyButton from '@/components/ui/CopyButton.vue';
import { useToast } from '@/composables/useToast';
import { useContactFormStore } from '@/stores/contactForm';
import { useContactsStore } from '@/stores/contacts';
import { useTextContentStore } from '@/stores/textContent';

const contactsStore = useContactsStore();
const contactFormStore = useContactFormStore();
const textContent = useTextContentStore();
const toast = useToast();

onMounted(() => {
  contactsStore.fetch();
  textContent.fetch();
});

// Псевдо-queue id для "mail log" стиля — детерминированно из id контакта,
// не случайное, чтобы не прыгало между рендерами.
function queueId(id: number): string {
  return ((id * 2654435761) % 0xffffff).toString(16).toUpperCase().padStart(6, '0');
}

const form = reactive({
  email: '',
  message: '',
  name: '',
});

const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email));
const isValid = computed(() => form.name.trim() && emailValid.value && form.message.trim());

async function onSubmit() {
  if (!isValid.value || contactFormStore.sending) return;

  try {
    const result = await contactFormStore.submit({
      email: form.email.trim(),
      message: form.message.trim(),
      name: form.name.trim(),
    });

    if (result.delivered) {
      toast.push(
        textContent.get('text_smtp_delivered', '250 2.0.0 OK — сообщение доставлено'),
        'success',
      );
    } else {
      toast.push(
        textContent.get(
          'text_smtp_no_telegram',
          '451 сообщение принято, но Telegram не настроен на бэкенде',
        ),
        'error',
      );
    }

    form.name = '';
    form.email = '';
    form.message = '';
  } catch (e) {
    const errMsg =
      e instanceof Error
        ? e.message
        : textContent.get('text_error_sending_message', 'Не удалось отправить сообщение');
    toast.push(`${textContent.get('text_smtp_error', '550')} ${errMsg}`, 'error');
  }
}
</script>

<template>
  <div class="p-6 sm:p-7">
    <!-- Список контактов в стиле лога почтовой очереди -->
    <template v-if="contactsStore.error">
      <p class="text-sm text-coral">{{ contactsStore.error }}</p>
      <button type="button" class="btn mt-2" @click="contactsStore.fetch()">{{ textContent.get('btn_retry', 'повторить') }}</button>
    </template>

    <template v-else-if="contactsStore.loading && !contactsStore.loaded">
      <p class="text-xs text-faint mb-4">{{ textContent.get('prompt_queue', 'подключение к очереди…') }}</p>
    </template>

    <template v-else>
      <div class="mb-6">
        <div
          v-for="contact in contactsStore.items"
          :key="contact.id"
          class="grid grid-cols-[78px_96px_1fr_auto_auto] max-[640px]:grid-cols-[1fr_auto] items-center gap-3 py-3 border-t border-borderSoft first:border-t-0 text-[13px]"
        >
          <span class="text-coral max-[640px]:order-1">{{ queueId(contact.id) }}</span>
          <span class="text-faint text-xs max-[640px]:hidden">{{ contact.label }}</span>
          <a
            v-if="contact.url"
            :href="contact.url"
            target="_blank"
            rel="noopener"
            class="text-text hover:text-mint border-b border-transparent hover:border-mintDim transition-colors break-all max-[640px]:order-2 max-[640px]:col-span-2"
          >
            {{ contact.value }}
          </a>
          <span v-else class="break-all max-[640px]:order-2 max-[640px]:col-span-2">{{ contact.value }}</span>
          <span class="text-mint text-xs whitespace-nowrap max-[640px]:order-3">{{ textContent.get('text_smtp_queue_delivered', '250 delivered') }}</span>
          <CopyButton :value="contact.value" class="max-[640px]:order-3" />
        </div>
      </div>
    </template>

    <!-- Форма обратной связи, стилизованная под команду swaks -->
    <p class="text-sm text-dim mb-1">
      <span class="text-mint">$</span> {{ textContent.get('prompt_sender_name', 'export SENDER_NAME=') }}"<input
        v-model="form.name"
        type="text"
        :placeholder="textContent.get('prompt_sender_name_placeholder', 'Ваше имя')"
        class="bg-transparent border-b border-borderSoft focus:border-mint outline-none text-text px-1 w-40"
      />"
    </p>

    <p class="text-sm text-dim mb-4"><span class="text-mint">$</span> {{ textContent.get('prompt_swaks', 'swaks \\') }}</p>

    <form
      class="pl-4 border-l-2 border-border space-y-1.5 text-sm font-mono"
      @submit.prevent="onSubmit"
    >
      <div class="text-dim">{{ textContent.get('prompt_to', '--to') }} <span class="text-text">"{{ textContent.get('prompt_to_value', 'user') }}" \</span></div>

      <div class="text-dim flex flex-wrap items-center gap-1">
        {{ textContent.get('prompt_from', '--from') }} "<input
          v-model="form.email"
          type="email"
          :placeholder="textContent.get('prompt_email_placeholder', 'Input your email')"
          class="bg-transparent border-b outline-none text-text px-1 min-w-[190px]"
          :class="form.email && !emailValid ? 'border-coral' : 'border-borderSoft focus:border-mint'"
        />" \
      </div>

      <div class="text-dim">
        {{ textContent.get('prompt_header', '--header') }} <span class="text-text">"Subject: {{ textContent.get('prompt_email_subject', 'Письмо с визитки') }}"</span> \
      </div>

      <div class="text-dim">
        {{ textContent.get('prompt_body', '--body') }} "<textarea
          v-model="form.message"
          rows="3"
          :placeholder="textContent.get('prompt_message_placeholder', 'Input message')"
          class="block w-full bg-transparent border border-borderSoft focus:border-mint outline-none text-text px-2.5 py-1.5 mt-1 rounded-md resize-y"
        ></textarea>"
      </div>

      <button type="submit" class="btn mt-1" :disabled="!isValid || contactFormStore.sending">
        {{ contactFormStore.sending ? textContent.get('btn_sending', 'sending…') : textContent.get('btn_submit', '▶ run') }}
      </button>
    </form>
  </div>
</template>
