import { ILogEntry, ILogChange, LogLevel } from "./types";

export class LogEntry<T = any> implements ILogEntry<T> {
	timestamp: Date;
	level: LogLevel;
	message: string;
	context?: T;
	error?: Error;
	pid: number;
	hostname: string;
	appName?: string;
	correlationId?: string;

	constructor(
		level: LogLevel,
		message: string,
		context?: T,
		error?: Error,
		appName?: string,
		correlationId?: string,
	) {
		this.timestamp = new Date();
		this.level = level;
		this.message = message;
		this.context = context;
		this.error = error;
		this.pid = typeof process !== "undefined" ? process.pid : 0;
		this.hostname =
			typeof process !== "undefined"
				? (process as any).hostname || "unknown"
				: "browser";
		this.appName = appName;
		this.correlationId = correlationId;
	}

	static createChange<T>(
		level: LogLevel,
		message: string,
		before: T,
		after: T,
		context?: T,
		error?: Error,
		appName?: string,
		correlationId?: string,
	): ILogChange<T> {
		const entry = new LogEntry<T>(
			level,
			message,
			context,
			error,
			appName,
			correlationId,
		);

		const changes = LogEntry.calculateChanges(before, after);

		return {
			entry,
			before,
			after,
			changes,
		};
	}

	private static calculateChanges<T>(
		before: T,
		after: T,
	): Partial<Record<keyof T, { before: any; after: any }>> {
		const changes: Partial<Record<keyof T, { before: any; after: any }>> =
			{};

		if (
			!before ||
			!after ||
			typeof before !== "object" ||
			typeof after !== "object"
		) {
			return changes;
		}

		const beforeKeys = new Set(Object.keys(before) as (keyof T)[]);
		const afterKeys = new Set(Object.keys(after) as (keyof T)[]);
		const allKeys = new Set([...beforeKeys, ...afterKeys]);

		for (const key of allKeys) {
			const beforeValue = before?.[key];
			const afterValue = after?.[key];

			if (JSON.stringify(beforeValue) !== JSON.stringify(afterValue)) {
				changes[key] = {
					before: beforeValue,
					after: afterValue,
				};
			}
		}

		return changes;
	}

	toJSON(): ILogEntry<T> {
		return {
			timestamp: this.timestamp,
			level: this.level,
			message: this.message,
			context: this.context,
			error: this.error
				? {
						name: this.error.name,
						message: this.error.message,
						stack: this.error.stack,
				  }
				: undefined,
			pid: this.pid,
			hostname: this.hostname,
			appName: this.appName,
			correlationId: this.correlationId,
		};
	}
}
