import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { getSubgraphUrl } from "config/subgraph";

export function createClient(chainId: number, subgraph: string) {
  const url = getSubgraphUrl(chainId, subgraph);
  const abortController = new AbortController();
  return new ApolloClient({
    // uri: url,
    link: createHttpLink({
      "uri": url,
      fetchOptions: {
        mode: 'cors',
        signal: abortController.signal,
      },
    }),
    cache: new InMemoryCache(),
  });
}
