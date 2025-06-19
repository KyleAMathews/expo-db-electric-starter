import {sql} from "drizzle-orm"
import { db } from '../../../src/db';
import { todos } from '../../../src/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Generic mutations ingestion endpoint for TanStack DB
 * 
 * This endpoint handles all mutations from the client and returns
 * the transaction ID that the changes were applied under.
 */
export async function POST(request: Request) {
  try {
    const mutations = await request.json();
    
    if (!Array.isArray(mutations)) {
      return Response.json({ error: 'Invalid mutations format' }, { status: 400 });
    }
    
    // Start a transaction to handle all mutations
    const result = await db.transaction(async (tx) => {
      for (const mutation of mutations) {
        const { type, table, data, where } = mutation;
        
        // Handle different mutation types
        switch (type) {
          case 'insert':
            if (table === 'todos') {
              await tx.insert(todos).values(data);
            }
            break;
            
          case 'update':
            if (table === 'todos' && where?.id) {
              await tx.update(todos)
                .set({
                  ...data,
                  updated_at: new Date()
                })
                .where(eq(todos.id, where.id));
            }
            break;
            
          case 'delete':
            if (table === 'todos' && where?.id) {
              await tx.delete(todos)
                .where(eq(todos.id, where.id));
            }
            break;
            
          default:
            throw new Error(`Unsupported mutation type: ${type}`);
        }
      }
      
      const [{ txid }] = await tx.execute(sql`SELECT txid_current() as txid`);
      return { txid };
    });
    
    return Response.json(result);
  } catch (error) {
    console.error('Error processing mutations:', error);
    return Response.json({ error: 'Failed to process mutations' }, { status: 500 });
  }
}
