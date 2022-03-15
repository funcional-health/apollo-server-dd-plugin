import type { GraphQLRequestContext } from 'apollo-server-core';
import tracer, { Span } from 'dd-trace';
import { ApolloServerPlugin } from 'apollo-server-plugin-base';

const dataDogTracePlugin: ApolloServerPlugin = {
  requestDidStart(startedRequest: GraphQLRequestContext) {
    const { request } = startedRequest;

    // We won't trace failed queries
    let span: Span | undefined;

    return {
      didResolveOperation(didResolveContext) {
        span = tracer.startSpan('graphql-request');

        span.setTag('graphql.query', request.query);

        if (request.operationName) {
          span.setTag('graphql.operationName', request.operationName);
        }

        const rootFields = didResolveContext.operation.selectionSet.selections
          .filter(({ kind }) => kind === 'Field')
          .map(({ name }: any) => name.value);

        const rootFieldName = rootFields.length > 1 ? 'multiple' : rootFields[0];
        const rootFieldType =
          didResolveContext.operation.operation === 'mutation' ? 'Mutation' : 'Query';

        span.setTag('resource.name', `GraphQL ${rootFieldType} ${rootFieldName}`);
      },

      willSendResponse({ response }) {
        if (span) {
          span.setTag('graphql.has_data', response?.data !== undefined);
          span.setTag('graphql.has_errors', response?.errors !== undefined);
          span.finish(new Date().getTime());
        }
      },
    };
  },
};

export { dataDogTracePlugin };
