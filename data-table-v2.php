<?php
    $conn = new mysqli('localhost','root', '', 'test');
    if(!$conn) exit;

    $qColumns = [];
    foreach($_POST['sql_cols'] as $col) {
        array_push($qColumns, $col);
    }
    $qFrom = $conn->real_escape_string($_POST['sql_from'] ?? '');
    $qJoin = $conn->real_escape_string($_POST['sql_join'] ?? '');
    $qWhere = $conn->real_escape_string($_POST['sql_where'] ?? '');
    $page = $conn->real_escape_string($_POST['page'] ?? 0);
    $limit = $conn->real_escape_string($_POST['limit'] ?? 20);
    $orderby = $conn->real_escape_string($_POST['orderby'] ?? 0);
    $order_direction = $conn->real_escape_string($_POST['order_direction'] ?? 'ASC');
    $offset = $limit * $page;

    $qSelect = implode(', ', $qColumns);
    $qCountRows = "(SELECT COUNT(*) FROM $qFrom $qWhere) as total_rows";
    $qLimit = "LIMIT $offset, $limit;";
    $qOrderBy = "ORDER BY {$qColumns[$orderby]} $order_direction";

    $result = $conn->query("SELECT $qSelect, $qCountRows FROM $qFrom $qJoin $qWhere $qOrderBy $qLimit");

    $rData = $result->fetch_all(MYSQLI_BOTH);

    $output = array();
    for($a = 0; $a < count($rData); $a++) {
        $row = array();
        for($i = 0; $i < count($qColumns); $i++)
            array_push($row, $rData[$a][$i]);
        array_push($output, $row);
    }

    echo json_encode(array([
        'data' => $output,
        'total_rows' => $rData[0]['total_rows']
    ]));
    exit;