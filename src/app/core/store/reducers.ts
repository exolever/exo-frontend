import { MediaLibraryState } from '@ecosystem-media-library/store/reducers';
import { EventState } from '@ecosystem/modules/events/store/events.reducer';
import { MyJobsState } from '@applications/my-jobs/store/my-jobs.reducer';
import { DirectoryState } from '@ecosystem/modules/directory/store/directory.reducer';
import { ProfileState } from '@applications/profile/store/user-profile.reducer';
import { ProjectsState } from '@applications/service/old-project/store/project';
import { ServiceState } from '@applications/service/old-project/store/reducers';
import { BreadCrumbState } from '@applications/breadcrumb/store/breadcrumb.reducers';
import { UserState } from '@core/store/user/user.reducer';
import { AskToEcosystemState } from '@applications/ask-to-ecosystem/store/reducer';
import { SwarmSessionsState } from '@applications/service/shared/modules/swarm-sessions/store/reducer';
import { CirclesState } from '@applications/circles/store/reducer';
import { ConversationState } from '@applications/shared/communication/store/reducer/communication.reducer';
import { SurveyState } from '@applications/ecosystem/modules/tools/exq/store/exq.reducer';
import { GenericProjectsState } from '@service/generic-project/store/reducer';
import { ProjectsState as WorkspaceProjectsState} from '@applications/workspace/projects/store/reducer';
import { CertificationsState } from '@core/modules/certifications/store/certifications.reducer';
import { RolesState } from '@core/modules/roles/store/roles.reducer';
import {
  OpportunityState
} from '@applications/ecosystem/modules/opportunities/store/reducers/';

export interface AppState {
  events: EventState;
  jobs: MyJobsState;
  directory: DirectoryState;
  mediaLibrary: MediaLibraryState;
  opportunities: OpportunityState;
  profile: ProfileState;
  projects: ProjectsState;
  service: ServiceState;
  user: UserState;
  breadcrumbs: BreadCrumbState;
  askToEcosystem: AskToEcosystemState;
  swarmSessions: SwarmSessionsState;
  circles: CirclesState;
  communication: ConversationState;
  surveys: SurveyState;
  workspaceProjects: WorkspaceProjectsState;
  genericProject: GenericProjectsState;
  certifications: CertificationsState;
  roles: RolesState;
}
