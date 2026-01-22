import { gql } from '@apollo/client';

export const BULLS_QUERY = gql`
  query GetBulls($input: BullsQueryInput) {
    bulls(input: $input) {
      edges {
        node {
          id
          caravana
          nombre
          uso
          origen
          pelaje
          raza
          edadMeses
          caracteristicaDestacada
          stats {
            crecimiento
            facilidadParto
            reproduccion
            moderacion
            carcasa
          }
          bullScore
          isFavorite
        }
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
        startCursor
        hasPreviousPage
      }
      totalCount
    }
  }
`;

export const BULL_QUERY = gql`
  query GetBull($id: Int!) {
    bull(id: $id) {
      id
      caravana
      nombre
      uso
      origen
      pelaje
      raza
      edadMeses
      caracteristicaDestacada
      stats {
        crecimiento
        facilidadParto
        reproduccion
        moderacion
        carcasa
      }
      bullScore
      isFavorite
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
    }
  }
`;
