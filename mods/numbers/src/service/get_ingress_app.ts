import {FonosError} from "@fonos/errors";
import {redis}from "@fonos/core";
import grpc from "grpc";
import logger from "@fonos/logger";
import jsonToApp from "@fonos/appmanager/src/service/json_to_app";
import {App} from "@fonos/appmanager/src/service/protos/appmanager_pb";

export default async function (e164Number: string): Promise<App> {
  const appRef = await redis.get(`extlink:${e164Number}`);

  logger.log("debug", `@fonos/core getIngressApp [appRef: ${appRef}]`);

  const appFromDB = await redis.get(appRef);

  if (!appFromDB) {
    throw new FonosError(`App ${appRef} not found`, grpc.status.NOT_FOUND);
  }

  return jsonToApp(JSON.parse(appFromDB));
}