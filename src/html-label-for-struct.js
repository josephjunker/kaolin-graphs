
import {assert, compose} from "./utils";
import {inspect} from 'util';

const show = x => inspect(x, { depth: null });

const escape = string =>
  string.replace(/</g, `[`)
        .replace(/>/g, `]`);

const label = str => `[shape=none label=<${str}>]`;

const validStyles = [
  "ALIGN",
  "BALIGN",
  "BGCOLOR",
  "BORDER",
  "CELLPADDING",
  "CELLSPACING",
  "COLOR",
  "COLSPAN",
  "FIXEDSIZE",
  "GRADIENTANGLE",
  "HEIGHT",
  "HREF",
  "ID",
  "PORT",
  "ROWSPAN",
  "SIDES",
  "STYLE",
  "TARGET",
  "TITLE",
  "TOOLTIP",
  "VALIGN",
  "WIDTH",
  "ROWS",
  "CELLBORDER"
];

const stylesToHTML = styles =>
  Object.keys(styles || {})
    .map(style => {
      assert(style => validStyles.includes(style.toUpperCase()),
             style => `Tried to use invalid style ${style}`)(style);
      return `${style.toUpperCase()}="${styles[style]}"`;
    }).join(" ");

const rowToHTML = row =>
  Array.isArray(row.contents) ?
    row.contents.map(item => `<TD ${stylesToHTML(item.style)}>${item.contents}</TD>`).join("") :
    `<TD>${row.contents}</TD>`;

const tableToHTML = tableDescriptor => {
  const rows = tableDescriptor.rows.map(
    row => `
      <TR ${stylesToHTML(row.style)}>
        ${rowToHTML(row)}
      </TR>
    `);

  return `
    <TABLE ${stylesToHTML(tableDescriptor.style)}>
      ${rows.join("\n")}
    </TABLE>
    `;
};

const makeTitleRow = typeName => ({
  contents: [{
    contents: `<B>${typeName}</B>`,
    style: {
      cellSpacing: 0,
      align: "CENTER"
    }
  }],
  style: {
    align: "CENTER",
    port: "title",
    cellSpacing: 0
  }
});

const makeFieldRow = (fieldName, fieldValue) => ({
  contents: [
    {
      contents: `<B>${fieldName}</B>`,
      style: {
        align: "LEFT"
      }
    },
    {
      contents: fieldValue ? ":" : "",
      style: {
        align: "CENTER"
      }
    },
    {
      contents: fieldValue || "",
      style: {
        align: "RIGHT",
        port: fieldName
      }
    }
  ]
});

const fieldForType = type => {
  switch (type.name) {
    case "string":
    case "boolean":
    case "number":
    case "function":
    case "object":
    case "any": return type.name;
    case "literal": return `literal: ${type.value}`;
    case "array": return `Array<${fieldForType(type.contents)}>`;
    case "laxStruct":
    case "strictStruct": return `Struct`;
    case "dictionary": return `Dictionary<${fieldForType(type.keys)}, ${fieldForType(type.values)}>`;
    case "reference": return type.referenceName;
    case "custom": return `${type.label}<${type.args.map(arg => fieldForType(arg)).join(", ")}>`;
    case "intersection": return `Intersection<${type.parents.map(parent => fieldForType(parent)).join(", ")}>`;
    case "alternatives": return `Alternatives<${type.options.map(option => fieldForType(option)).join(", ")}>`;
    case "optional": return `(optional) ${fieldForType(type.contents)}`;
    default: throw new Error(`kaolin-graphs does not support creating record nodes for ${type.name} types`);
  }
};

const makeTable = (types, typeName) => ({
  rows: [makeTitleRow(typeName)].concat(
    Object.keys(types[typeName].fields)
    .sort()
    .map(fieldName => makeFieldRow(
      fieldName,
      escape(fieldForType(types[typeName].fields[fieldName]))))),
  style: {
    rows: "*",
    cellBorder: 0
  }
});

export default (types, typeName) => {
  assert(type => ["strictStruct", "laxStruct"].includes(type.name),
         type => "Tried to draw a non-struct as a record: " + show(type))(types[typeName]);

  return label(tableToHTML(makeTable(types, typeName)));
};

