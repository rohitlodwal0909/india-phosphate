import { Button } from 'flowbite-react';
import { Icon } from '@iconify/react';

interface Props {
  onPrint?: () => void;
  onExcel?: () => void;
}

const CommonTableActions = ({ onPrint, onExcel }: Props) => {
  return (
    <div className="flex gap-2">
      <Button size="sm" color="success" onClick={onExcel}>
        <Icon icon="mdi:file-excel-outline" className="mr-1" />
        Excel
      </Button>

      <Button size="sm" color="gray" onClick={onPrint}>
        <Icon icon="solar:printer-outline" className="mr-1" />
        Print
      </Button>
    </div>
  );
};

export default CommonTableActions;
