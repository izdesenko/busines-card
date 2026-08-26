import { gql } from 'graphql-request';

export const SEND_CONTACT_FORM = gql`
  mutation SendContactForm($input: ContactFormInput!) {
    sendContactForm(input: $input) {
      delivered
    }
  }
`;
