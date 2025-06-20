import {
  electricCollectionOptions,
  ElectricCollectionUtils,
} from "@tanstack/db-collections";
import Constants from "expo-constants";
import { createCollection, type Transaction } from "@tanstack/react-db";
import { Todo, selectTodoSchema } from "../db/schema";

const hostname = new URL(Constants.linkingUri).hostname;

/**
 * Todo collection with ElectricSQL integration
 */
export const todoCollection = createCollection(
  electricCollectionOptions({
    id: "todos",
    schema: selectTodoSchema,
    // Electric syncs data using "shapes". These are filtered views
    // on database tables that Electric keeps in sync for you.
    shapeOptions: {
      url: `http://${hostname}:3000/v1/shape`,
      params: {
        table: "todos",
      },
      parser: {
        // Parse timestamp columns into JavaScript Date objects
        timestamptz: (date: string) => {
          return new Date(date);
        },
      },
    },
    getKey: (item) => item.id,
  }),
);

/**
 * Generic mutation function for handling all mutations
 */
export const mutationFn = async ({
  transaction,
}: {
  transaction: Transaction<Partial<Todo>>;
}) => {
  const payload = transaction.mutations.map((mutation) => {
    const { collection: _, ...rest } = mutation;
    return rest;
  });

  const response = await fetch("/api/ingest/mutations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    // Throwing an error will rollback the optimistic state
    throw new Error(`HTTP Error: ${response.status}`);
  }

  const result = await response.json();

  // Wait for the transaction to be synced back from the server
  // before discarding the optimistic state
  const utils = transaction.mutations[0].collection
    .utils as ElectricCollectionUtils;

  // Monitor the incoming sync stream for the database transaction ID
  await utils.awaitTxId(result.txid);
};
