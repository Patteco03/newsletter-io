import { PrismaClient } from "../prisma/generated/client";

const prismaBase = new PrismaClient();

const prisma = prismaBase.$extends({
  query: {
    $allModels: {
      async findUnique({ args, query }) {
        return query(applySoftDeleteFilter(args));
      },

      async findFirst({ args, query }) {
        return query(applySoftDeleteFilter(args));
      },

      async findMany({ args, query }) {
        return query(applySoftDeleteFilter(args));
      },
    },
  },

  model: {
    $allModels: {
      async softDelete(this: any, where: Record<string, any>) {
        return this.update({
          where,
          data: { deletedAt: new Date() },
        });
      },

      async restore(this: any, where: Record<string, any>) {
        return this.update({
          where,
          data: { deletedAt: null },
        });
      },
    },
  },
});

function applySoftDeleteFilter(args: Record<string, any> = {}) {
  const where = { ...args.where };

  if (where.deletedAt === undefined) {
    where.deletedAt = null;
  }

  return { ...args, where };
}

export default prisma;
export { prisma as db };
