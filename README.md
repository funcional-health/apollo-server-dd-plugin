# Apollo Server Datadog Plugin

Custom Datadog instrumentation for Apollo Server.

## Installation

```sh
yarn add @funcional-health/apollo-server-dd-plugin
```

Then add the plugin to your NestJS GraphQL Module configuration:

```ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { dataDogTracePlugin } from '@funcional-health/apollo-server-dd-plugin';

@Module({
  imports: [
    // ...
    GraphQLModule.forRoot({
      // ...
      plugins.push(dataDogTracePlugin)
    }),
    // ...
  ],
})
export class AppModule {}
```
