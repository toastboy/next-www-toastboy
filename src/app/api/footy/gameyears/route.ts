import gameDayService from 'services/GameDay';
import { handleGET } from '../common';

export const GET = () => handleGET(gameDayService.getAllYears);
