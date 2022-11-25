import { defineRoute } from '../../../../define-route';

export function GET() {
  return defineRoute({
    handler() {
      return 'OK';
    },
  });
}
