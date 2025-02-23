use mini_social_media;

delimiter |

CREATE TRIGGER protectCommentOnDelete
BEFORE DELETE ON comments
FOR EACH ROW
BEGIN
    -- Xóa các like trong bảng users_comments trước khi xóa comment
    DELETE FROM users_comments WHERE comment_id = OLD.id;

    -- Xóa đệ quy tất cả các comment con
    DELETE FROM comments WHERE parent_comment_id = OLD.id;
END;

|
delimiter ;

drop trigger protectCommentOnDelete;

delete from comments
where id = "f91fefec-a186-4f8b-a800-cf7dbadd32fb"

