import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";


export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://graphql.eng.meridiancapital.com/graphql",
  }),
  cache: new InMemoryCache(),
});