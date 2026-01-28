import type { InvitationDecision } from '@/lib/invitations';
import type { NewGameInput } from '@/types/NewGameInput';

/**
 * Server action proxy type for the triggerInvitations action.
 * Enables dependency injection for components and stories without importing
 * the server-only action directly.
 *
 * Triggers the process of sending game invitations based on the provided input,
 * checking timing constraints and game availability before sending.
 *
 * @param data - Validated input containing optional custom message and override time check flag.
 * @returns A promise that resolves to an InvitationDecision indicating the status and
 * associated game day ID if applicable.
 */
export type TriggerInvitationsProxy = (data: NewGameInput) => Promise<InvitationDecision>;
