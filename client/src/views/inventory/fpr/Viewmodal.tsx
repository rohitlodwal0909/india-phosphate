import {
  Modal,
  ModalBody,
  ModalHeader
} from "flowbite-react";

interface AddModalProps {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  rowData: any;
}

const ViewModal: React.FC<AddModalProps> = ({
  placeModal,
  modalPlacement,
  setPlaceModal,
  rowData,
}) => {
  const data = rowData?.batch_releases;

  return (
    <Modal
      show={placeModal}
      position={modalPlacement}
      onClose={() => setPlaceModal(false)}
      size="7xl"
    >
      {/* Header with Close Button */}
      <ModalHeader className="flex justify-between items-center">
        
      </ModalHeader>

      <ModalBody>
        <div
          style={{
            border: "2px solid #000",
            padding: "40px 50px",
            width: "800px",
            margin: "auto",
            fontFamily: "Times New Roman, serif",
            fontSize: "16px",
            lineHeight: "1.6",
            backgroundColor: "white",
            color: "#111",
          }}
        >
          {/* HEADER */}
          <div style={{ textAlign: "center" }}>
            <h2
              style={{
                margin: 0,
                fontWeight: "bold",
                fontSize: "20px",
                color: "#111",
              }}
            >
              INDIA PHOSPHATE AND ALLIED INDUSTRIES PVT. LTD.
            </h2>
            <h3
              style={{
                margin: "10px 0 20px 0",
                textDecoration: "underline",
                fontWeight: "bold",
                color: "#111",
              }}
            >
              FINISHED PRODUCT RELEASE NOTE
            </h3>
          </div>

          {/* TO / FROM */}
          <p style={{ fontWeight: "bold", color: "#111" }}>
            To:{" "}
            <span style={{ fontWeight: "normal", color: "#333" }}>
              Store Department
            </span>
          </p>
          <p style={{ fontWeight: "bold", color: "#111" }}>
            From:{" "}
            <span style={{ fontWeight: "normal", color: "#333" }}>
              Quality Assurance Department
            </span>
          </p>

          <p style={{ margin: "20px 0", color: "#111" }}>
            Following batches are released for dispatch:
          </p>

          {/* DETAILS SECTION */}
          <div style={{ marginTop: "25px" }}>
            <p style={lineText}>
              Release No.:{" "}
              <span style={lineValue}>{data?.release_no || "—"}</span>
            </p>
            <p style={lineText}>
              Product Name:{" "}
              <span style={lineValue}>{rowData?.product_name || "—"}</span>
            </p>
            <p style={lineText}>
              Batch Number:{" "}
              <span style={lineValue}>{rowData?.qc_batch_number || "—"}</span>
            </p>
            <p style={lineText}>
              Manufacturing Date:{" "}
              <span style={lineValue}>{rowData?.mfg_date || "—"}</span>
            </p>
            <p style={lineText}>
              Expiry Date:{" "}
              <span style={lineValue}>{rowData?.exp_date || "—"}</span>
            </p>
            <p style={lineText}>
              Release Date:{" "}
              <span style={lineValue}>{data?.release_date || "—"}</span>
            </p>
          </div>

          {/* FOOTER */}
          <p style={{ marginTop: "15px", fontWeight: "bold", color: "#111" }}>
            F-01/QA/017/05
          </p>

          {/* SIGNATURE */}
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontWeight: "bold", color: "#111" }}>
                Authorization & Signature
              </p>
              <p style={{ margin: 0, fontWeight: "bold", color: "#111" }}>
                QA OFFICER
              </p>
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

// Styles for line format
const lineText: React.CSSProperties = {
  fontWeight: "bold",
  marginBottom: "14px",
  borderBottom: "1px solid #000",
  paddingBottom: "6px",
  color: "#111",
};

const lineValue: React.CSSProperties = {
  fontWeight: "normal",
  color: "#333",
};

export default ViewModal;
