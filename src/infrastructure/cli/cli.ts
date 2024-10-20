import { RunMigrationsCommand } from "./commands/RunMigrationsCommand";
import { RunMigrationsForceCommand } from "./commands/RunMigrationsForceCommand";
import { RevertMigrationCommand } from "./commands/RevertMigrationCommand";
import { FixMigrationsCommand } from "./commands/FixMigrationsCommand";

const command = process.argv[2];

switch (command) {
    case "run-migrations":
        RunMigrationsCommand.execute();
        break;
    case "run-migrations-force":
        RunMigrationsForceCommand.execute();
        break;
    case "revert-migration":
        RevertMigrationCommand.execute();
        break;
    case "fix-migrations":
        FixMigrationsCommand.execute();
        break;
    default:
        console.log("Unknown command");
        process.exit(1);
}