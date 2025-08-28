"use client";

import type { Rule } from "@/store/useRuleStore";

function Keyword({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-gray-700">{children}</span>;
}

function Field({ children }: { children: React.ReactNode }) {
  return <span className="text-blue-600">{children}</span>;
}

function Value({ children }: { children: React.ReactNode }) {
  return <span className="text-green-600">{children}</span>;
}

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-gray-100 text-purple-600 px-1 rounded mx-1">
      {children}
    </code>
  );
}

export default function RuleDescription({ rule }: { rule: Rule }) {
  if (!rule) return null;

  if (rule.type === "conditional") {
    return (
      <span className="text-sm leading-relaxed">
        <Keyword>When</Keyword>{" "}
        <Field>
          {rule.when.source} - {rule.when.field}
        </Field>{" "}
        <span className="text-gray-700">{rule.when.clause}</span>
        {rule.when.compareWith?.value && (
          <Value> {rule.when.compareWith.value}</Value>
        )}
        , <Keyword>then</Keyword>{" "}
        <span className="text-gray-800">{rule.then.action}</span>
        {rule.then.formula && <Formula>{rule.then.formula}</Formula>}
        {rule.then.value && <Value> {rule.then.value}</Value>}
        {rule.then.value === "" && <Value>{rule.then.value}</Value>}
        {rule.then.from && (
          <Field>
            {" "}
            from {rule.then.from.source} - {rule.then.from.field}
          </Field>
        )}
      </span>
    );
  }

  if (rule.type === "direct") {
    return (
      <span className="text-sm leading-relaxed">
        <Keyword>Always</Keyword>{" "}
        <span className="text-gray-800">{rule.then.action}</span>
        {rule.then.formula && <Formula>{rule.then.formula}</Formula>}
        {rule.then.value && <Value> "{rule.then.value}"</Value>}
        {rule.then.from && (
          <Field>
            {" "}
            from {rule.then.from.source} - {rule.then.from.field}
          </Field>
        )}
      </span>
    );
  }

  return null;
}
