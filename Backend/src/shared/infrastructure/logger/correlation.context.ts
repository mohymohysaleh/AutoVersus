import { AsyncLocalStorage } from 'node:async_hooks';

export interface CorrelationContext {
  correlationId: string;
  userId?: string;
  route?: string;
  clientIp?: string;
}

const correlationContextStore = new AsyncLocalStorage<CorrelationContext>();

export function getCorrelationContext(): CorrelationContext | undefined {
  return correlationContextStore.getStore();
}

export function getCorrelationId(): string | undefined {
  const store = correlationContextStore.getStore();
  return store?.correlationId;
}

export function runWithCorrelationContext<T>(
  context: CorrelationContext,
  callback: () => T
): T {
  return correlationContextStore.run(context, callback);
}
