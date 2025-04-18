import { Modal } from "antd";
import AnalyticsResourceViewer from "./resource-viewer-modal";

export type TemplateModule             =   { type: "template"};
export type LibraryModule              =   { type: "library" };
export type RoomModule                 =   { type: "room"; roomId: string };
export type DeckModule                 =   { type: "deck"; deckId: string };
export type ContentPerformanceModule   =   { type: "contentPerformance" };

type ModuleType = RoomModule | DeckModule | LibraryModule | ContentPerformanceModule | TemplateModule;

const AnalyticsResourceViewerModal = (props: { isOpen: boolean, onClose: () => void, resource: any, module: ModuleType }) => {

    const { isOpen, onClose } = props;

    return (
        <Modal
            centered
            destroyOnClose
            className   =   {`j-room-resource-metric-modal`}
            open        =   {isOpen}
            onCancel    =   {onClose}
            footer      =   {null}
            closeIcon   =   {false}
        >
            {isOpen && <AnalyticsResourceViewer {...props} />}
        </Modal>
    )
}

export default AnalyticsResourceViewerModal