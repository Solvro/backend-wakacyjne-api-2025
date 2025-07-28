import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "./auth/auth.module";
import { PhotosModule } from "./photos/photos.module";
import { PlacesModule } from "./places/places.module";
import { UsersModule } from "./users/users.module";
import { validate } from "./validate";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    }),
    AuthModule,
    UsersModule,
    PhotosModule,
    PlacesModule,
  ],
})
export class AppModule {}
