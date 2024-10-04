const { Todo } = require('./models'); // Adjust the path if necessary
const minimist = require('minimist');

const args = minimist(process.argv.slice(2));
const id = args.id; // Get the ID from the command line arguments

if (!id) {
    console.error("Please provide an ID using --id=YOUR_ID");
    process.exit(1);
}

async function deleteTodo() {
    try {
        const result = await Todo.destroy({
            where: { id: id }
        });

        if (result === 0) {
            console.log(`Todo with ID ${id} not found.`);
        } else {
            console.log(`Todo with ID ${id} deleted successfully.`);
        }
    } catch (error) {
        console.error("Error deleting todo:", error);
    }
}

deleteTodo();