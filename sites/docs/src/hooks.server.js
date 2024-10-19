import logger from '$lib/logger';

export async function handle({ event, resolve }) {
  const start = Date.now();

  // Log the incoming request
  logger.info('Incoming request', {
    method: event.request.method,
    url: event.url.pathname,
    ip: event.getClientAddress(),
  });

  // Process the request and get the response
  const response = await resolve(event);

  // Calculate the response time
  const responseTime = Date.now() - start;

  // Log the response
  logger.info('Response sent', {
    method: event.request.method,
    url: event.url.pathname,
    status: response.status,
    responseTime: `${responseTime}ms`,
  });

  return response;
}