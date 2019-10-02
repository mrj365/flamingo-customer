interface FileReaderEvent extends Event {
    target: FileReaderEventTarget;
    getMessage(): string;
}