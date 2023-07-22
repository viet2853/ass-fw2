import { PlusOutlined } from "@ant-design/icons";
import { Form, Modal, Row, Upload } from "antd";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import { FormInstance } from "rc-field-form";
import { useEffect, useState } from "react";
import { baseURL } from "../../../../api/config";
import { getProfileFromLS } from "../../../../utils";

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface IInputUploadGallery {
  form: FormInstance<any>;
  name?: string;
  files?: string[];
}
function InputUploadGallery({
  form,
  name = "images",
  files = [],
}: IInputUploadGallery) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const accessToken = getProfileFromLS().accessToken;

  const handleChange: UploadProps["onChange"] = ({ fileList }) => {
    const fileListUrl: string[] = [];

    fileList.forEach((file: UploadFile<any>) => {
      if (file.status === "done") {
        fileListUrl.push(file?.url || file?.response?.urls?.[0]?.url);
      }
      if (!file.status) {
        /* eslint-disable no-param-reassign */
        file.status = "error";
      }
    });

    form.setFieldsValue({
      [name]: fileListUrl,
    });
  };

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      // eslint-disable-next-line no-param-reassign
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    setPreviewTitle(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };
  return (
    <>
      <Form.Item initialValue={files} name={name}>
        <Upload
          name="images"
          listType="picture-card"
          defaultFileList={files.map((file, index) => ({
            uid: `-${index}`,
            name: file,
            status: "done",
            url: file,
          }))}
          onPreview={handlePreview}
          onChange={handleChange}
          multiple
          action={`${baseURL}/images/upload`}
          headers={{ Authorization: `Bearer ${accessToken}` }}
        >
          {uploadButton}
        </Upload>
      </Form.Item>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <Row align="middle" justify="center">
          <img alt="example" style={{ maxWidth: "100%" }} src={previewImage} />
        </Row>
      </Modal>
    </>
  );
}

export default InputUploadGallery;
