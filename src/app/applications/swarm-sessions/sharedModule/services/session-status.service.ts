import * as MomentTz from 'moment-timezone';
import { SwarmSession } from '../models/session.model';

export class SessionStatusService {
  /**
   * weather the swarm session is held today
   */
  isSwarmToday(session: SwarmSession): boolean {
    return MomentTz().isSame(session.startAt, 'day');
  }

  /**
   * gets the swarm session total duration in seconds
   */
  getTotalDurationInSeconds(session: SwarmSession): number {
    return session.endAt ? session.endAt.diff(session.startAt, 's') : 0;
  }

  /**
   * weather the session has expired
   */
  isSessionStarted(session: SwarmSession): boolean {
    const now = MomentTz();
    return now.isAfter(session.startAt);
  }

  sessionExpiredDaysAgo(session: SwarmSession, daysExpired: number): boolean {
    const now = MomentTz().subtract(daysExpired, 'd');
    return now.isAfter(session.endAt);
  }

  /**
   * weather the session has expired
   */
  isSessionExpired(session: SwarmSession): boolean {
    const now = MomentTz();
    return now.isAfter(session.endAt);
  }

  /**
   * get hours left to the end of the session
   */
  getHoursLeft(session: SwarmSession): number {
    return Math.floor(this.getTimeDiff(session) / 3600);
  }

  /**
   * get minutes left to the end of the session
   */
  getMinutesLeft(session: SwarmSession): number {
    return Math.floor(this.getTimeDiff(session) / 60 % 60);
  }

  /**
   * get seconds left to the end of the session
   */
  getSecondsLeft(session: SwarmSession): number {
    return Math.floor(this.getTimeDiff(session) % 60);
  }

  /**
   * get time difference between now and session end in seconds
   */
  private getTimeDiff(session: SwarmSession): number {
    const current = MomentTz();
    return session.endAt ? session.endAt.diff(current, 's') : 0;
  }

  /**
   * more than half a session passed
   */
  isMoreThanHalfSessionPassed(session: SwarmSession): boolean {
    return this.getTotalDurationInSeconds(session) / 2 > this.getTimeDiff(session);
  }

  /**
   * about to expire
   */
  isAboutToExpireSession(session: SwarmSession): boolean {
    return this.getHoursLeft(session) === 0 && this.getMinutesLeft(session) < 15;
  }
}
