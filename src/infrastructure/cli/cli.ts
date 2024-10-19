import { RunMigrationsCommand } from "./commands/RunMigrationsCommand";
import { RunMigrationsForceCommand } from "./commands/RunMigrationsForceCommand";

const command = process.argv[2];

switch (command) {
    case "run-migrations":
        RunMigrationsCommand.execute();
        break;
    case "run-migrations-force":
        RunMigrationsForceCommand.execute();
        break;
    default:
        console.log("Unknown command");
        process.exit(1);
}