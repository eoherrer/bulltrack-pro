import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        id
        email
        name
      }
    }
  }
`;

export const TOGGLE_FAVORITE_MUTATION = gql`
  mutation ToggleFavorite($input: ToggleFavoriteInput!) {
    toggleFavorite(input: $input) {
      bullId
      isFavorite
    }
  }
`;
