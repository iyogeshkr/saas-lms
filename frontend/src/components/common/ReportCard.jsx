import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CsvIcon from "@mui/icons-material/TableChart";
import PrintIcon from "@mui/icons-material/Print";

const ReportCard = ({
  title,
  description,
  onExportPDF,
  onExportCSV,
  onPrint,
  children,
}) => {
  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 3,
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          px: 3,
          py: 2,
          background: "linear-gradient(135deg, #f7f9ff, #eef1ff)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
        </Box>

        <Box display="flex" gap={1}>
          {onExportPDF && (
            <Tooltip title="Export PDF">
              <IconButton
                size="small"
                onClick={onExportPDF}
                sx={{
                  border: "1px solid",
                  borderColor: "error.light",
                  color: "error.main",
                  "&:hover": { bgcolor: "error.light" },
                }}
              >
                <PictureAsPdfIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {onExportCSV && (
            <Tooltip title="Export CSV">
              <IconButton
                size="small"
                onClick={onExportCSV}
                sx={{
                  border: "1px solid",
                  borderColor: "primary.light",
                  color: "primary.main",
                  "&:hover": { bgcolor: "primary.light" },
                }}
              >
                <CsvIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {onPrint && (
            <Tooltip title="Print">
              <IconButton
                size="small"
                onClick={onPrint}
                sx={{
                  border: "1px solid",
                  borderColor: "secondary.light",
                  color: "secondary.main",
                  "&:hover": { bgcolor: "secondary.light" },
                }}
              >
                <PrintIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      <Divider />

      <CardContent sx={{ p: 3 }}>
        {children}
      </CardContent>
    </Card>
  );
};

export default ReportCard;
