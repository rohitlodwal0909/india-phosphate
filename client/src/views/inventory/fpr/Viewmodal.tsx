import { Modal, ModalBody, ModalHeader } from 'flowbite-react';

interface ViewModalProps {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  rowData: any;
}

const ViewModal: React.FC<ViewModalProps> = ({ placeModal, modalPlacement, setPlaceModal, rowData }) => {
  const releases = Array.isArray(rowData?.batch_releases) ? rowData.batch_releases : [];
  const releasedQuantity = releases.reduce((sum: number, item: any) => sum + Number(item.quantity || 0), 0);

  return <Modal show={placeModal} position={modalPlacement} onClose={() => setPlaceModal(false)} size="7xl">
    <ModalHeader>Finished Product Release Note</ModalHeader>
    <ModalBody>
      <div className="mx-auto max-w-3xl border-2 border-black bg-white p-10 font-serif text-base leading-relaxed text-gray-900">
        <div className="text-center">
          <h2 className="text-xl font-bold">INDIA PHOSPHATE AND ALLIED INDUSTRIES PVT. LTD.</h2>
          <h3 className="mt-2 text-lg font-bold underline">FINISHED PRODUCT RELEASE NOTE</h3>
        </div>
        <p className="mt-8"><b>To:</b> Store Department</p>
        <p><b>From:</b> Quality Assurance Department</p>
        <div className="mt-6 space-y-2">
          <p><b>Product:</b> {rowData?.product_name || '-'}</p>
          <p><b>Batch Number:</b> {rowData?.qc_batch_number || '-'}</p>
          <p><b>Actual Batch Quantity:</b> {rowData?.actual_batch_quantity || 0}</p>
          <p><b>Total Released:</b> {releasedQuantity}</p>
          <p><b>Manufacturing Date:</b> {rowData?.mfg_date || '-'}</p>
          <p><b>Expiry Date:</b> {rowData?.exp_date || '-'}</p>
        </div>
        <h4 className="mt-8 border-b border-black pb-2 font-bold">Release Entries</h4>
        <table className="mt-2 w-full text-left">
          <thead><tr><th className="py-2">Release No.</th><th>Date</th><th>Quantity</th></tr></thead>
          <tbody>{releases.map((release: any) => <tr key={release.id} className="border-t border-gray-300">
            <td className="py-2">{release.release_no || '-'}</td><td>{release.release_date || '-'}</td><td>{release.quantity || 0}</td>
          </tr>)}{!releases.length && <tr><td colSpan={3} className="py-3">No release entries recorded.</td></tr>}</tbody>
        </table>
        <p className="mt-10 font-bold">F-01/QA/017/05</p>
        <div className="mt-6 text-right"><b>Authorization &amp; Signature<br />QA OFFICER</b></div>
      </div>
    </ModalBody>
  </Modal>;
};

export default ViewModal;
