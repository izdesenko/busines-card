import { gql } from 'graphql-request';

export const GET_SKILLS = gql`
  query GetSkills {
    getSkills {
      category
      skills {
        id
        name
        level
      }
    }
  }
`;

export const GET_PROJECTS = gql`
  query GetProjects {
    getProjects {
      id
      title
      description
      technologies
      githubLink
      liveLink
      order
    }
  }
`;

export const GET_TEXT_CONTENTS = gql`
  query GetTextContents {
    getTextContents {
      key
      value
    }
  }
`;

export const GET_CONTACTS = gql`
  query GetContacts {
    getContacts {
      id
      type
      label
      value
      url
      order
    }
  }
`;
