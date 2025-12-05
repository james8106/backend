import { Module } from "@nestjs/common";
import { UsersModule} from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { PositionsModule } from "./positions/positions.module";
import { PositionsController } from "./positions/positions.controller";
import { PositionsService } from "./positions/positions.service";

@Module({
  imports: [UsersModule, AuthModule, DatabaseModule, PositionsModule,],
})
export class AppModule {}