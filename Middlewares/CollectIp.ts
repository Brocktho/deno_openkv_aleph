/** @format */

import { ConnInfo } from "https://deno.land/std@0.192.0/http/server.ts";

const CollectIps = (connInfo: ConnInfo) => {
  const { hostname } = connInfo.remoteAddr as Deno.NetAddr;
  return hostname;
};

export default CollectIps;
