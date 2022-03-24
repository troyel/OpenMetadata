/*
 *  Copyright 2021 Collate
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { DynamicObj, Paging } from 'Models';
import { DatabaseService } from '../generated/entity/services/databaseService';
import { MessagingService } from '../generated/entity/services/messagingService';
import { PipelineService } from '../generated/entity/services/pipelineService';

export interface DashboardService {
  description: string;
  href: string;
  id: string;
  name: string;
  serviceType: string;
  ingestionSchedule?: { repeatFrequency: string; startDate: string };
  dashboardUrl?: string;
  username?: string;
  password?: string;
  url?: string;
  api_key?: string;
  site_name?: string;
  api_version?: string;
  server?: string;
  env?: string;
}

export interface DataObj {
  id?: string;
  description: string | undefined;
  ingestionSchedule?:
    | {
        repeatFrequency: string;
        startDate: string;
      }
    | undefined;
  name: string;
  serviceType: string;
  databaseConnection?: {
    hostPort: string;
    password: string;
    username: string;
    database: string;
    connectionArguments: DynamicObj;
    connectionOptions: DynamicObj;
  };
  brokers?: Array<string>;
  schemaRegistry?: string;
  dashboardUrl?: string;
  username?: string;
  password?: string;
  url?: string;
  api_key?: string;
  site_name?: string;
  api_version?: string;
  server?: string;
  env?: string;
  pipelineUrl?: string;
}

export interface EditObj {
  edit: boolean;
  id?: string;
}

export type ServiceDataObj = { name: string } & Partial<DatabaseService> &
  Partial<MessagingService> &
  Partial<DashboardService> &
  Partial<PipelineService>;

export interface ServiceResponse {
  data: Array<ServiceDataObj>;
  paging: Paging;
}
