# Flow - Workflow Automation App

## Project Overview

Flow is a React-based web application that helps automate and streamline repetitive tasks through guided, multi-step workflows with conditional branching logic.

## Primary Purpose

The app helps users execute complex, multi-step workflows consistently by providing:
- Clear, step-by-step checklists with conditional logic
- Branching workflows that adapt based on user choices and configurations
- Fixed, non-editable workflows designed for consistent execution
- Support for various workflows (VPS setup, deployment processes, configuration tasks, etc.)

## Core Functionality

- **Step-by-step workflow guidance**: Clear progression through complex tasks
- **Conditional branching**: Workflows adapt based on user selections
- **Fixed workflow definitions**: Pre-defined, tested workflows that ensure consistency
- **Progress tracking**: Visual indication of workflow completion status
- **Multi-workflow support**: Handle different types of technical workflows beyond just VPS creation

## Technical Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Package Manager**: Bun

## Development Guidelines

- Follow React best practices and hooks patterns
- Use TypeScript for type safety
- Implement responsive design with Tailwind CSS
- Keep workflows as data structures that drive the UI
- Focus on clean, maintainable code architecture
- Prioritize user experience and workflow efficiency

## Workflow Types (Initial)

## Commands

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun preview` - Preview production build

## Git Commit Guidelines

- Never add anything related to claude in git commits