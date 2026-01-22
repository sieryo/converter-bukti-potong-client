export interface RenameJobStatus {
    job_id: string;
    status: "queued" | "processing" | "done" | "error";
    total_files: number;
    processed_files: number;
    skipped_files: number;
    error?: string;
}