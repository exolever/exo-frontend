import { NgModule } from '@angular/core';

import { SocketService } from '@applications/sockets/service/socket.service';

@NgModule({
  providers: [ SocketService ]
})
export class SocketModule {}
