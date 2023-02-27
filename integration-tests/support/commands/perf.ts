interface CommandPerfStats {
  name: string;
  startTime: number;
  endTime?: number;
}

interface CommandPerfGroup {
  name: string;
  start: number;
  end?: number;
  duration?: number;
  commands?: CommandPerfStats[];
}

let commands: CommandPerfStats[];
let groups: CommandPerfGroup[];
let fileName: string;

export const initPerfMeasuring = (logFile: string) => {
  commands = [];
  groups = [];
  fileName = logFile;

  Cypress.on('command:start', (command) => {
    commands.push({
      name: command.attributes.name,
      startTime: Date.now(),
    });
  });

  Cypress.on('command:end', (command) => {
    const c = commands[commands.length - 1];
    if (c.name !== command.attributes.name) {
      throw new Error('command does not match');
    }
    c.endTime = Date.now();
  });

  Cypress.Commands.add('perfGroupStart', (groupName: string) => {
    if (Cypress.browser.isHeaded && !Cypress.env('perfmark')) {
      Cypress.env('perfmark', true);
      cy.task('deleteFile', fileName);
    }

    groups.push({
      name: groupName,
      start: Date.now(),
    });
  });

  Cypress.Commands.add('perfGroupEnd', (groupName: string) => {
    const group = groups.find((value) => value.name === groupName);
    if (group) {
      group.end = Date.now();
    }
    const groupCommands = commands.filter((value) => {
      return value.startTime >= group.start && value.endTime <= group.end;
    });
    group.duration = group.end - group.start;
    group.commands = Cypress._.cloneDeep(groupCommands);

    cy.task('readFileIfExists', fileName).then((contents: string | null) => {
      if (contents) {
        const items = JSON.parse(contents);
        if (!items.length) {
          const temp = [items];
          temp.push(group);
          cy.writeFile(fileName, temp);
        } else {
          items.push(group);
          cy.writeFile(fileName, items);
        }
      } else {
        cy.writeFile(fileName, [group]);
      }
    });
  });
};
