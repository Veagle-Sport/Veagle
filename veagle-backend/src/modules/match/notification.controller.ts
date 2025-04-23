import { Controller, Get, Param, Sse, Post } from "@nestjs/common";
import { Observable, Subject } from "rxjs";
import { MatchService } from "./match.service";
import { Match, MatchDocument } from "./schena/match.schema";
import { MongoDbId } from "src/common/DTOS/mongodb-Id.dto";
import { CreateMatchDto } from "./dto/create-match.dto";
import { ApiParam } from "@nestjs/swagger";

@Controller('notifications')
export class NotificationService {
   private matchReady$ = new Subject<any>();

  constructor(private readonly matchService: MatchService) {}

   getMatchNotifier(): Observable<any> {
    return this.matchReady$.asObservable();
  }

   sendMatchReadyNotification(matchId: MongoDbId) {
    this.matchReady$.next({ matchId });
  }

   @Get('/match/:matchId')
  async getMatchNotification(@Param('matchId') matchId: any): Promise<Match> {
    const match = await this.matchService.findOne(matchId);
      this.sendMatchReadyNotification(matchId);

    return match as Promise<Match>  ;
  }

  @Sse('match')
  notifyMatch(): Observable<CreateMatchDto> {
    return new Observable<CreateMatchDto>((subscriber) => {
      const subscription = this.getMatchNotifier().subscribe((data) => {
         subscriber.next(data);
      });

      return () => subscription.unsubscribe();
    });
  }

}
