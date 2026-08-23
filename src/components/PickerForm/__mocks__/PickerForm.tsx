import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';

import type { SetGameEnabledProxy } from '@/types/actions/SetGameEnabled';
import type { SubmitPickerProxy } from '@/types/actions/SubmitPicker';
import type { PickerPlayerType } from '@/types/PickerPlayerType';

interface Props {
    gameDay: GameDayType;
    players: PickerPlayerType[];
    submitPicker: SubmitPickerProxy;
    setGameEnabled: SetGameEnabledProxy;
}

export const PickerForm = (props: Props) => (
    <div>PickerForm: {JSON.stringify(props)}</div>
);
PickerForm.displayName = 'PickerForm';
